---
layout: wide
---

<div class="tag-lead">
  {{ content }}
</div>
<div class="posts">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <div class="photo-post">
        <a href="{{ post.url }}" >
            <img src="{{ post.image }}" alt="{{ post.title | default: post.date }}"/>
        </a>
      </div>
    {% endfor %}
  {% else %}
    <blockquote>
      <p>There are no posts with this tag.</p>
    </blockquote>
    <p>View <a href="/posts">all posts</a>.</p>
  {% endif %}
</div>
