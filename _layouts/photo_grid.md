---
layout: wide
---

<div class="tag-lead">
  {{ content }}
</div>
<div class="photo-grid">
<ul class="grid">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <li class="item " title="{{ post.title | default: post.date }}">
        <a class="" href="{{ post.url }}" >
            <img alt="{{ post.title }}" class="lazyload" data-src="{{ post.image }}" src="" height="" width="" />
            <span class="date-published">
              {{ post.title | default: post.date | date_to_string }}
              <br/>
              {{ post.date | date: "%B %Y"  }}
            </span>
        </a>
      </li>
    {% endfor %}
  {% else %}
    <blockquote>
      <p>There are no posts with this tag.</p>
    </blockquote>
    <p>View <a href="/posts">all posts</a>.</p>
  {% endif %}
</ul>
</div>
<script>
  lazyload();
</script>
